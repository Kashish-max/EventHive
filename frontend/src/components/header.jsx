import { useDispatch } from "react-redux"
import { setOpen } from "@/store/authSlice";

import Search from "./search"

export default function Header() {
  const dispatch = useDispatch();

  return (
    <header className="z-10 w-full max-w-6xl items-center justify-between font-mono text-sm lg:flex">
      <button onClick={() => dispatch(setOpen(true))}>
        <div className="fixed left-0 top-0 flex justify-center w-full border-b border-gray-400 bg-gradient-to-b from-zinc-200 pb-4 pt-6 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-2">
          <Search inputClass="bg-gray-200 rounded-xl lg:rounded-none lg:bg-transparent p-3 lg:p-2 pe-12"/>
        </div>
      </button>
      <div className="text-2xl font-bold fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
        <div className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
          EventHive
        </div>
      </div>
    </header>    
  )
}
