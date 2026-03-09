export default function branchReducer(state = { branches: [] }, action) {
  switch (action.type) {
    case "SET_BRANCHES":
      return { ...state, branches: action.payload };
    default:
      return state;
  }
}