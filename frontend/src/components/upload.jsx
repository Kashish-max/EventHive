import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

const Upload = ({name, accept, text, icon, previewState, handleChange }) => {
    return (
        <div>
            <label
            htmlFor={name}
            className="relative flex flex-col items-center cursor-pointer rounded-md bg-white font-semibold text-blue-600 hover:text-blue-500"
            >
                { previewState ?
                    <img src={previewState} alt="Preview" className="mx-auto max-w-48 max-h-48" />
                    :
                    <>
                        <p className="text-sm text-black font-normal pb-4 font-['ProductSans']">{text + ' '}<span className="text-red-700">*</span></p>
                        <div className="p-3 bg-blue-500 rounded-full w-fit mb-4">
                            {icon ? icon : <CloudArrowUpIcon className="h-12 w-12 text-white" aria-hidden="true" />}
                        </div>                                                                                                                                                                        
                    </>                                                        
                }
                <span className="font-['ProductSans'] text-sm">Click here to upload</span>
                <input id={name} name={name} type="file" accept={accept} className="sr-only" onChange={handleChange} required={!previewState} />
            </label>
        </div>
    )
}

export default Upload;