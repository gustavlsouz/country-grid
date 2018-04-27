import React, { Children, cloneElement } from 'react'


const Row = props => {

    const childProps = {
        className: "col-md-3"
    }

    if (Children.count(props.children) > 0) {
        return (
            <div className="row center">
                {Children.map(props.children, child => {
                    return cloneElement(child, childProps)
                })}
            </div>
        )
    }
    
    return null

}

export default Row
