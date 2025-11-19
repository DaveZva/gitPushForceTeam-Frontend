import React, { useId, useRef, useState } from 'react'
import {
    CCol,
    CButton,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CFormSelect,
} from '@coreui/react'
import { CPasswordInput, CStepper } from '@coreui/react-pro'

export const StepperExample = () => {
    const stepperRef = useRef(null)
    const uid = useId()
    const [currentStep, setCurrentStep] = useState(1)
    const [finish, setFinish] = useState(false)

    const steps = [
        {
            label: 'Step 1',
            content: (
                <CForm className="row g-3">
                    <CCol md={4}>
                        <CFormInput type="text" defaultValue="Łukasz" label="First name" />
                    </CCol>
                    <CCol md={4}>
                        <CFormInput type="text" defaultValue="Holeczek" label="Last name" />
                    </CCol>
                    <CCol md={4}>
                        <CFormLabel htmlFor={`validationCustomUsername-${uid}-01`}>Username</CFormLabel>
                        <CInputGroup>
                            <CInputGroupText id={`inputGroupPrependFeedback-${uid}`}>@</CInputGroupText>
                            <CFormInput
                                type="text"
                                id={`validationCustomUsername-${uid}-01`}
                                aria-describedby={`inputGroupPrependFeedback-${uid}`}
                            />
                        </CInputGroup>
                    </CCol>
                </CForm>
            ),
        },
        {
            label: 'Step 2',
            content: (
                <CForm className="row g-3">
                    <CCol md={6}>
                        <CFormInput type="text" label="City" />
                    </CCol>
                    <CCol md={3}>
                        <CFormSelect label="State">
                            <option disabled>Choose...</option>
                            <option>...</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                        <CFormInput type="text" label="Zip" />
                    </CCol>
                </CForm>
            ),
        },
        {
            label: 'Step 3',
            content: (
                <CForm className="row g-3">
                    <CCol md={6}>
                        <CFormInput type="email" label="Email" />
                    </CCol>
                    <CCol md={6}>
                        <CPasswordInput label="Password" />
                    </CCol>
                    <CCol xs={12}>
                        <CFormCheck type="checkbox" label="Agree to terms and conditions" />
                    </CCol>
                </CForm>
            ),
        },
    ]
    return (
        <>
            <CStepper
                steps={steps}
                onFinish={() => setFinish(true)}
                onReset={() => setFinish(false)}
                onStepChange={setCurrentStep}
                ref={stepperRef}
            />
            {finish && <div>All steps are complete—you're finished.</div>}
            <div className="d-flex gap-2 mt-4">
                {!finish && currentStep > 1 && (
                    <CButton color="secondary" onClick={() => stepperRef.current?.prev()}>
                        Previous
                    </CButton>
                )}
                {!finish && currentStep < steps.length && (
                    <CButton color="primary" onClick={() => stepperRef.current?.next()}>
                        Next
                    </CButton>
                )}
                {!finish && currentStep === steps.length && (
                    <CButton color="primary" onClick={() => stepperRef.current?.finish()}>
                        Finish
                    </CButton>
                )}
                {finish && (
                    <CButton color="danger" onClick={() => stepperRef.current?.reset()}>
                        Reset
                    </CButton>
                )}
            </div>
        </>
    )
}