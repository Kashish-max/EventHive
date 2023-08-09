import { useDispatch } from "react-redux"
import { setOpen, setDefaultTab } from "@/store/authSlice";

export default function Footer() {
  const dispatch = useDispatch();

  return (
    <footer className="opportunities mb-32 grid lg:mb-0 xl:grid-cols-4">
      <button
        onClick={() => {
          dispatch(setDefaultTab('hackathons'))
          dispatch(setOpen(true))
        }}
        className="group text-center xl:text-left rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Hackathons{' '}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] mx-auto text-sm opacity-50`}>
          Explore and participate in hackathons around the world.
        </p>
      </button>

      <button
        onClick={() => {
          dispatch(setDefaultTab('host'))
          dispatch(setOpen(true))
        }}
        className="group text-center xl:text-left rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          Host{' '}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] mx-auto text-sm opacity-50`}>
          Host your Hackathon on our platform and get access to our community.
        </p>
      </button>

      <button
        onClick={() => {
          dispatch(setDefaultTab('registrations'))
          dispatch(setOpen(true))
        }}
        className="group text-center xl:text-left rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          My Registrations{' '}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] mx-auto text-sm opacity-50`}>
          View all your registered hackathons in one place.
        </p>
      </button>

      <button
        onClick={() => {
          dispatch(setDefaultTab('listings'))
          dispatch(setOpen(true))
        }}
        className="group text-center xl:text-left rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`mb-3 text-2xl font-semibold`}>
          My Listing{' '}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className={`m-0 max-w-[30ch] mx-auto text-sm opacity-50`}>
          View all your hosted hackathons in one place.
        </p>
      </button>
    </footer>
  )
}
