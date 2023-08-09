import { Dialog } from '@headlessui/react'
import Search from '../search'

export default function ModalLayout({icon, title, description, showSearch=false ,children}) { 
    return (
    <div>
        {/* Header */}
        <div className="p-6 pb-8 lg:flex justify-center lg:justify-between">
            <div className="lg:flex lg:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 lg:mx-0 lg:h-10 lg:w-10">
                    {icon}
                </div>
                <div className="mt-3 text-center lg:ml-4 lg:mt-1 lg:text-left">
                    <Dialog.Title as="h3" className="text-3xl font-semibold leading-6 text-gray-900">
                        {title}
                    </Dialog.Title>
                    <div className="mt-2">
                        <p className="text-md text-gray-500">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
            {
                showSearch &&
                <div className="lg:flex items-center w-fit mx-auto lg:mx-0 mt-4 lg:mt-0 lg:pr-14">
                    <Search inputClass="border border-gray-300 px-3 py-2 rounded-md bg-gray-50"/>
                </div>
            }
        </div>

        {/* Body */}
        {children}
    </div>
  )
}