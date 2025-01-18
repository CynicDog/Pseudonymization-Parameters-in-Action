import React, { useState } from 'react';
import { applyMasking } from "../util.js";

const P7 = ({ data }) => {
    const [specifier, setSpecifier] = useState('/\\d{4}/');
    const [replacement, setReplacement] = useState('*');
    const [targetField, setTargetField] = useState('phone_number');

    const fields = ['name', 'phone_number', 'address', 'date_of_birth'];

    // Function to handle field selection
    const handleFieldSelect = (field) => {
        setTargetField(field);

        if (field === 'phone_number') {
            setSpecifier('/\\d{4}/');
        } else if (field === 'address') {
            setSpecifier('18:29');
        } else if (field === 'date_of_birth') {
            setSpecifier('mm-dd');
        } else {
            setSpecifier('-3');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center flex-row pb-4" style={{marginTop: "80px"}}>
                <span className="fs-5 fw-lighter text-secondary me-1">대체문자</span>
                "
                <span>{replacement}</span>
                "
                <span className="mx-2">&</span>
                <span className="fs-4 fw-light mx-2">범위지정</span>
                "
                <input
                    className="border-0 rounded-2 bg-primary-subtle mx-1"
                    type="text"
                    value={specifier}
                    onChange={(e) => setSpecifier(e.target.value)}
                    placeholder={specifier}
                    style={{
                        width: "80px",
                        fontSize: "larger",
                        textAlign: "center",
                    }}
                />
                "
            </div>

            {/* Original Data */}
            <div className="d-flex justify-content-center align-items-center flex-column py-3">
                <div>
                    <span className="fs-4 fw-lighter">전) </span>
                    {fields.map((field, index) => (
                        <React.Fragment key={index}>
                            <span
                                role="button"
                                className={field === targetField ? 'rounded-3 bg-danger-subtle fs-4 px-1' : 'text-secondary px-1'}
                                onClick={() => handleFieldSelect(field)}
                            >
                                {data.data[0][field]}
                            </span>
                            {index < fields.length - 1 && ' | '}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Masked Data */}
            <div className="d-flex justify-content-center align-items-center flex-column py-3">
                <div>
                    <span className="fs-4 fw-lighter">후) </span>
                    {fields.map((field, index) => (
                        <React.Fragment key={index}>
                            <span className={field === targetField ? 'rounded-3 bg-success-subtle fs-4 px-1' : 'text-secondary px-1'}>
                                {targetField === field
                                    ? applyMasking(data.data[0][field], specifier, replacement)
                                    : data.data[0][field]}
                            </span>
                            {index < fields.length - 1 && ' | '}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default P7;
