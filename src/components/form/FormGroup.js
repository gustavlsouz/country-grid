import React, { createElement } from 'react'

const FormGroup = props => {

    const component = props.component

    const field = props.field

    const componentProps = {
        field: field
        , id: field
        , defaultValue: props.defaultValue
        , className: "form-control"
        , type: "text"
    }
    
    if (props.options) {
        componentProps.options = props.options
    }

    return (
        <div className="form-group">
            <label htmlFor={field}>{props.label}:</label>

            {
                createElement(component, componentProps)
            }

        </div>
    )
}


export default FormGroup

export {
    FormGroup
}
