import CustomBreadCrumb from '@/components/ui/CustomBreadCrumb'
import React from 'react'

const FormMockInterviewPage = ({initialData}) => {
  return (
    <div className='w-full flex-col space-y-4'>
        <CustomBreadCrumb breadCrumbPage={breadCrumbPage} breadCrumbItem={[{label:"Mock Interview",link:"/generate"}]}></CustomBreadCrumb>
    </div>
  )
}

export default FormMockInterviewPage