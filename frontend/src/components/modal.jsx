import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  Tooltip
} from "@material-tailwind/react";
import { XMarkIcon } from '@heroicons/react/24/outline'

import { selectOpen, setOpen } from '@/store/authSlice'
import TabsWithIcon from './tabs'

export default function Modal({authData}) {
  const dispatch = useDispatch();
  const open = useSelector(selectOpen);
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => dispatch(setOpen(false))}>
      <div className="z-50 flex sm:hidden fixed bottom-8 sm:bottom-12 right-8">
          <SpeedDial>
              <SpeedDialHandler>
                  <IconButton size="md" className="rounded-full">
                    <Tooltip content="close" placement="left">
                      <button className="flex" onClick={() => dispatch(setOpen(false))}>
                        <XMarkIcon className="h-5 w-5 transition-transform" />
                      </button>
                    </Tooltip>
                  </IconButton>
              </SpeedDialHandler>
          </SpeedDial>
      </div>        
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-0 text-center items-start">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden sm:rounded-lg bg-white text-left shadow-xl transition-all mx-0 sm:mx-6 sm:my-8 sm:w-full sm:max-w-6xl">
                <div className="bg-white font-['ProductSans'] w-screen min-h-screen sm:w-full sm:min-h-full">
                  <TabsWithIcon authData={authData} />                  
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
