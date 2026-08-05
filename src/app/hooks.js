// Thin re-export of the Redux hooks from the store.
// Kept as a separate module so components can import the
// canonical `useAppDispatch` / `useAppSelector` hooks from
// a stable, conventional location (`app/hooks`).
export { useAppDispatch, useAppSelector } from "./store.js";
