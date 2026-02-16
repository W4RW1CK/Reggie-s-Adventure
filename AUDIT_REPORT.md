# Reggie's Adventure - Code Audit Report

**Auditor**: Subagent  
**Date**: 2026-02-16  
**Repository**: `/tmp/reggies-adventure` (branch: `updates`, commit: `4a75755`, v0.2.31)  

## Executive Summary

This audit focused on **logic bugs, data flow problems, state management issues, and runtime errors** in the Reggie's Adventure codebase. The application is generally well-structured with good separation of concerns, but several critical and high-impact issues were identified that could cause state corruption, race conditions, and unexpected behavior.

## 🔴 CRITICAL ISSUES

### 1. Race Condition in Stat Decay Hook
**Severity**: 🔴 Critical  
**File**: `/tmp/reggies-adventure/src/hooks/useStatDecay.ts`  
**Line(s)**: 42-48  
**Issue**: The first `useEffect` has an empty dependency array `[]` but relies on `stats` and `lastUpdated` being available. This means the initial offline decay calculation will never run when data becomes available after mounting.  
**Impact**: Users returning after being offline won't see their pet's stats properly decayed, breaking the core game mechanic of time-based stat reduction.  
**Fix**:
```typescript
// Change line 42:
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Run once on mount (conceptually), but guarded by stats availability

// To:
}, [stats, lastUpdated]); // React to data availability

// But add guard to prevent multiple runs:
const hasRunInitialDecay = useRef(false);
useEffect(() => {
    if (!stats || !lastUpdated || hasRunInitialDecay.current) return;
    hasRunInitialDecay.current = true;
    // ... rest of decay logic
}, [stats, lastUpdated]);
```

### 2. Stale Chat History in API Calls
**Severity**: 🔴 Critical  
**File**: `/tmp/reggies-adventure/src/hooks/useChat.ts`  
**Line(s)**: 83  
**Issue**: The API request sends `messages.slice(-10)` but this is the OLD messages array before the current user message is added, providing incomplete context to the AI.  
**Impact**: AI responses may be inconsistent or lack proper context because they don't see the user's current message in the conversation history.  
**Fix**:
```typescript
// Replace line 83:
history: messages.slice(-10), // Send last 10 for context window

// With:
history: updatedHistory.slice(-10), // Send updated history including current message
```

## 🟠 HIGH PRIORITY ISSUES

### 3. Potential State Race in `updateStatsWithDeltas`
**Severity**: 🟠 High  
**File**: `/tmp/reggies-adventure/src/hooks/useGameState.ts`  
**Line(s)**: 67-95  
**Issue**: The function uses functional state updates but doesn't handle rapid successive calls. Multiple quick stat changes could result in lost updates or inconsistent state.  
**Impact**: Action spam or multiple simultaneous stat changes (chat + action + decay) could cause stat values to be incorrect.  
**Fix**:
```typescript
// Add ref to track pending updates and debounce/queue them:
const pendingUpdatesRef = useRef<Partial<RegenmonStats>[]>([]);

const updateStatsWithDeltas = useCallback((deltas: Partial<RegenmonStats>) => {
    pendingUpdatesRef.current.push(deltas);
    
    // Debounce updates
    const processUpdates = () => {
        const allDeltas = pendingUpdatesRef.current;
        pendingUpdatesRef.current = [];
        
        // Merge all pending deltas
        const mergedDeltas = allDeltas.reduce((acc, delta) => {
            Object.entries(delta).forEach(([key, value]) => {
                acc[key as keyof RegenmonStats] = (acc[key as keyof RegenmonStats] || 0) + value;
            });
            return acc;
        }, {} as Partial<RegenmonStats>);
        
        // Apply merged deltas...
    };
    
    setTimeout(processUpdates, 0); // Next tick
}, []);
```

### 4. Storage Error Handling Could Return Invalid Data
**Severity**: 🟠 High  
**File**: `/tmp/reggies-adventure/src/lib/storage.ts`  
**Line(s)**: 12-18  
**Issue**: If JSON.parse fails, the function returns `defaultValue` but if `defaultValue` is null and the caller expects a specific structure, this could cause errors downstream.  
**Impact**: Corrupted localStorage data could crash the app or cause unexpected behavior when components receive null instead of expected data structures.  
**Fix**:
```typescript
function getStorageItem<T>(key: string, defaultValue: T): T {  // Remove | null
    if (!isBrowser) return defaultValue;
    try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        const parsed = JSON.parse(item);
        return parsed !== null ? parsed : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        // Clear corrupted data
        localStorage.removeItem(key);
        return defaultValue;
    }
}
```

### 5. Incorrect Critical State Logic in Chat
**Severity**: 🟠 High  
**File**: `/tmp/reggies-adventure/src/hooks/useChat.ts`  
**Line(s)**: 44-47  
**Issue**: The condition uses AND (`&&`) operator, meaning the pet can only chat if ALL three stats are below critical threshold simultaneously. This should probably be OR (`||`) - if ANY stat is critical, chat should be disabled.  
**Impact**: Pet continues to chat even when critically low on individual stats, which doesn't match the intended game balance.  
**Fix**:
```typescript
// Change line 44-47:
if (espiritu < CHAT_CRITICAL_THRESHOLD &&
    pulso < CHAT_CRITICAL_THRESHOLD &&
    hambre < CHAT_CRITICAL_THRESHOLD) {

// To:
if (espiritu < CHAT_CRITICAL_THRESHOLD ||
    pulso < CHAT_CRITICAL_THRESHOLD ||
    pulso < CHAT_CRITICAL_THRESHOLD) { // Any critical stat disables chat
```

## 🟡 MEDIUM PRIORITY ISSUES

### 6. Missing Cleanup in `useStatDecay`
**Severity**: 🟡 Medium  
**File**: `/tmp/reggies-adventure/src/hooks/useStatDecay.ts`  
**Line(s)**: 77-87  
**Issue**: The interval is recreated every time `stats`, `lastUpdated`, or `calculateDecay` changes, but `calculateDecay` is in the dependency array and recreated on every render due to its dependencies, causing unnecessary interval cycling.  
**Impact**: Performance degradation due to frequent interval creation/destruction and potential memory leaks.  
**Fix**:
```typescript
// Remove calculateDecay from dependencies and inline the logic:
useEffect(() => {
    if (!stats || !lastUpdated) return;

    const intervalId = setInterval(() => {
        if (!statsRef.current || !lastUpdatedRef.current) return;

        // Inline calculateDecay logic here to avoid dependency
        const now = Date.now();
        const last = new Date(lastUpdatedRef.current).getTime();
        const hoursElapsed = (now - last) / 3600000;
        const decayAmount = Math.floor(hoursElapsed * DECAY_RATE_PER_HOUR);
        
        if (decayAmount <= 0) return;
        
        // ... rest of calculation
    }, DECAY_INTERVAL_MS);

    return () => clearInterval(intervalId);
}, [stats, lastUpdated]); // Remove calculateDecay dependency
```

### 7. Potential Memory Leak in Audio Hook
**Severity**: 🟡 Medium  
**File**: `/tmp/reggies-adventure/src/hooks/useChiptuneAudio.ts`  
**Line(s)**: 493-507  
**Issue**: The timeout in the type change effect could be cleared if the component unmounts or dependencies change rapidly, but there's no cleanup function returned.  
**Impact**: Potential timer leak if components unmount during the 50ms delay.  
**Fix**:
```typescript
// Add cleanup for timeout:
useEffect(() => {
    if (enabled && isPlayingRef.current && currentTypeRef.current !== type) {
        stopPlayback();
        const timer = setTimeout(() => startPlayback(), 50);
        return () => clearTimeout(timer); // Add this cleanup
    }
    // ... rest of effect
}, [enabled, type, startPlayback, stopPlayback]);
```

### 8. Chat Error Recovery Incomplete
**Severity**: 🟡 Medium  
**File**: `/tmp/reggies-adventure/src/hooks/useChat.ts`  
**Line(s)**: 116-124  
**Issue**: When a chat error occurs, an error message is added but the optimistically added user message remains, potentially confusing the conversation flow.  
**Impact**: Failed API calls leave stale user messages in chat without clear indication they weren't processed.  
**Fix**:
```typescript
} catch (error) {
    console.error('Chat Error:', error);
    
    // Remove the optimistically added user message
    setMessages(prev => prev.slice(0, -1));
    
    // Add system error message
    const errorMsg: ChatMessage = {
        role: 'assistant',
        content: '... (ruido estático) ...',
        timestamp: Date.now(),
    };
    setMessages(prev => [...prev, errorMsg]);
    saveChatHistory([...messages, errorMsg]);
}
```

## 🟢 LOW PRIORITY ISSUES

### 9. Unnecessary Dependency in `useGameState`
**Severity**: 🟢 Low  
**File**: `/tmp/reggies-adventure/src/hooks/useGameState.ts`  
**Line(s)**: 28-34  
**Issue**: `handleUpdateStats` includes `regenmon` in its dependency array, causing the callback to be recreated every time regenmon data changes.  
**Impact**: Minor performance issue due to unnecessary re-renders of child components.  
**Fix**:
```typescript
// Use functional updates instead of depending on regenmon:
const handleUpdateStats = useCallback((newStats: RegenmonStats) => {
    setRegenmon(current => {
        if (!current) return null;
        const updated = { ...current, stats: newStats, lastUpdated: new Date().toISOString() };
        saveRegenmon(updated);
        return updated;
    });
}, []); // Remove regenmon dependency
```

### 10. Missing Error Boundary Components
**Severity**: 🟢 Low  
**File**: Throughout application  
**Issue**: No React Error Boundaries are implemented to catch JavaScript errors in component trees.  
**Impact**: Unhandled errors could crash the entire app instead of showing a graceful error message.  
**Fix**: Add Error Boundary components around major sections like GameScreen, ChatBox, etc.

## Data Flow Verification ✅

### Stats System Logic Consistency
- ✅ **Espíritu**: Increases with sleep (+10), decreases with chat responses (±5), decays over time (-2/hour)
- ✅ **Pulso**: Increases with training (+10), decreases with chat (-2), decays over time (-2/hour)  
- ✅ **Hambre**: Decreases with feeding (-10), increases with chat (+1), increases over time (+2/hour) ← **This is correct - hambre represents hunger level**

### Game Flow Logic
- ✅ **First-time flow**: LOADING → TITLE → STORY → CREATION → TRANSITION → GAME
- ✅ **Returning flow**: LOADING → TITLE → GAME (if regenmon exists)
- ✅ **Name changes**: Limited to one change per regenmon (properly tracked)
- ✅ **Tutorial**: Shows once per regenmon, can be dismissed permanently

### Edge Cases Handled
- ✅ **Zero stats**: Actions properly disabled when stats too low
- ✅ **Max stats**: Bounds checking prevents values exceeding 100
- ✅ **Empty localStorage**: Proper defaults provided
- ✅ **SSR safety**: `isBrowser` checks prevent server-side localStorage access

## Security Considerations ✅

- ✅ **API Keys**: Properly using environment variables, not in client code
- ✅ **Rate Limiting**: 15 requests per minute implemented  
- ✅ **Input Validation**: Chat messages limited to 280 characters
- ✅ **XSS Protection**: No dangerous `innerHTML` usage found
- ✅ **Error Information**: No sensitive data leaked in error messages

## Performance Assessment ✅

- ✅ **Memoization**: Appropriate use of `useMemo` for expensive calculations
- ✅ **Re-renders**: Most components properly optimized, minor issues noted above
- ✅ **Memory usage**: Audio and interval cleanup generally handled correctly
- ⚠️ **Bundle size**: Chiptune audio data is large but inline (acceptable for this use case)

## Recommendations

### Immediate Actions Required (Critical/High)
1. **Fix stat decay initialization race condition** - critical for core game mechanic
2. **Fix chat history context issue** - affects AI response quality
3. **Review critical state logic in chat** - affects game balance
4. **Add state update queuing** - prevents race conditions

### Medium-term Improvements
1. Implement proper error boundaries
2. Add integration tests for state management flows
3. Consider using a state management library (Zustand/Redux) for complex state interactions
4. Add data migration system for localStorage schema changes

### Technical Debt
- The codebase is well-structured with good separation of concerns
- TypeScript usage is consistent and properly typed
- Component organization follows logical patterns
- Error handling is generally robust but could be improved

## Conclusion

The Reggie's Adventure codebase is **functionally sound** with good architecture, but has several **critical state management issues** that should be addressed before Session 3. The most important fixes are the stat decay initialization bug and the chat history context issue, as these directly impact core game functionality.

The application demonstrates good engineering practices overall, with proper type safety, reasonable performance optimizations, and appropriate security measures. Once the critical issues are resolved, the codebase will be robust and maintainable for future development.