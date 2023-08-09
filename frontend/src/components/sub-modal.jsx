import { Fragment, useRef, useState, useEffect } from 'react';
import { Spinner, Progress } from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';

import { makeRequest } from './helpers';
import Upload from './upload';


export default function SubModal({open, setOpen, enrollment, refresh}) {
  const cancelButtonRef = useRef(null)
  const [test, setTest] = useState(false); // This is just to stop the modal from closing on clicking outside the modal
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [subFile, setSubFile] = useState(null);
  const [subFilePreview, setSubFilePreview] = useState(null);

  const handleFileChange = (event) => {
    setSubFile(event.target.files[0]);
    console.log(enrollment.hackathon.submission_type[0])
    const file = event.target.files[0];
    try {
      const reader = new FileReader();
      
      if(enrollment.hackathon.submission_type[0] == "file") {
        console.log('File submission type is file.');
        setSubFilePreview("/assets/docs.png");
      } else {
        reader.onloadend = () => {
          const previewImage = reader.result;
          setSubFilePreview(previewImage);
        };
        reader.readAsDataURL(file);          
      }
    } catch {
      console.error('An error occurred while reading the file.');
      setSubFile(null);
      setSubFilePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    data['hackathon'] = enrollment?.hackathon?.id;
    data[(enrollment?.submission_type[0]) + '_submission'] = subFile;

    const accessToken = Cookies.get('access_token');
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    setTimeout(async () => {
      setUploading(true);
      try {
        const response = await makeRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/hackathons/submit/`, 'POST', data, config);
        if (response.status === 201) {
          console.log('Submission successfull.');
          let t = 0;
          const interval = setInterval(() => {
            if (t < 100) {
              setProgress(prevProgress => prevProgress + 1);
              t = t + 1
            } else {
              setTimeout(() => {
                refresh();
                setOpen(false);
                setUploading(false);
                setProgress(0);
                setLoading(false);
                clearInterval(interval);
              }, 1000);
            }
          }, 10)
        } else {
          setLoading(false);
          console.log('Submission request failed.', response);
        }
      } catch (error) {
        setLoading(false);
        console.error('An error occurred during submission: ', error);
      }

    }, 1000);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setTest}>
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    {enrollment?.submission_type == "link" && 
                      <div className="sm:flex items-center w-full">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                              <PaperClipIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                          </div>
                          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left grow">
                              <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 font-['ProductSans'] !font-normal">
                                  Submit Link to your Project
                              </Dialog.Title>
                          </div>
                      </div>                
                    }
                    <div className="mt-2">
                          {enrollment?.submission_type == "file" ?
                              <Upload 
                                  name="file_submission"
                                  accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  text="Upload File of your Project"
                                  icon={<PaperClipIcon className="h-12 w-12 text-white p-1.5" aria-hidden="true" />}                                
                                  previewState={subFilePreview}
                                  handleChange={handleFileChange}
                              />
                              :
                              (enrollment?.submission_type == "image" ?
                                  <Upload 
                                      name="image_submission"
                                      accept="image/*"
                                      text="Upload Image of your Project"
                                      previewState={subFilePreview}
                                      handleChange={handleFileChange}
                                  />
                                  :
                                  <input 
                                      type="text" 
                                      name="link_submission" 
                                      id="link_submission" 
                                      className="border border-gray-300 px-3 py-1 rounded-md bg-gray-50 w-full"
                                      required
                                  />
                              )
                          }
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 font-['ProductSans']">
                    { loading ?
                        (uploading ?
                          <div className="w-full">
                            <div className="mb-2 flex items-center justify-between gap-4">
                              <p className={progress < 100 ? "text-blue-600 text-sm" : "text-green-600 text-sm font-semibold"}>
                                {progress < 100 ? "In progress..." : "Completed"}
                              </p>
                              <p className={progress < 100 ? "text-blue-600 text-sm" : "text-green-600 text-sm font-semibold"}>
                                {progress}%
                              </p>
                            </div>
                            <Progress value={progress} color={progress < 100 ? "blue" : "green"} />
                          </div>
                          :
                          <button
                            type="button"
                            className="px-4 inline-flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm sm:ml-3 sm:w-auto"
                          >
                            <Spinner color="white" className="h-4 w-4" />
                            <span className="ms-2">Please wait...</span>
                          </button>
                        ) 
                      :
                      <>
                        <button
                          type="submit"
                          className="px-4 inline-flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          className="px-4 mt-3 inline-flex w-full justify-center items-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => {                            
                            setOpen(false)
                            setSubFile(null)
                            setSubFilePreview(null)
                          }}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>                    
                      </>
                    }
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
