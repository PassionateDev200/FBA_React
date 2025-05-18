import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

// Initial state
const initialState = {
  currentPage: 1,
  selectedBoxId: null,
  totalPages: 1,
  itemsPerPage: 5,
};

// Create context
const BoxContext = createContext();

// Reducer function to handle state updates
function boxReducer(state, action) {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_SELECTED_BOX":
      return { ...state, selectedBoxId: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    default:
      return state;
  }
}

// Provider component
export function BoxProvider({ children }) {
  const [state, dispatch] = useReducer(boxReducer, initialState);

  // Actions
  const setCurrentPage = useCallback((page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  }, []);

  const setSelectedBox = useCallback(
    (boxId) => {
      dispatch({ type: "SET_SELECTED_BOX", payload: boxId });

      // When a box is selected, calculate which page it's on
      if (boxId !== null && boxId > 11) {
        const adjustedId = boxId - 12;
        const pageForBox = Math.floor(adjustedId / state.itemsPerPage) + 1;
        if (pageForBox !== state.currentPage) {
          setCurrentPage(pageForBox);
        }
      }
    },
    [state.itemsPerPage, state.currentPage]
  );

  const setTotalPages = useCallback((pages) => {
    dispatch({ type: "SET_TOTAL_PAGES", payload: pages });
  }, []);

  // Value object
  const value = {
    state,
    actions: {
      setCurrentPage,
      setSelectedBox,
      setTotalPages,
    },
  };

  return <BoxContext.Provider value={value}>{children}</BoxContext.Provider>;
}

// Custom selector hook (similar to useSelector)
export function useBoxSelector(selector) {
  const context = useContext(BoxContext);
  if (context === undefined) {
    throw new Error("useBoxSelector must be used within a BoxProvider");
  }
  return selector(context);
}

// Convenience hooks for common selections
export function useBoxState() {
  return useBoxSelector((context) => context.state);
}

export function useBoxActions() {
  return useBoxSelector((context) => context.actions);
}
