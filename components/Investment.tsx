import {InputNumber} from "antd";
import React from "react";

function Investment({
                        showInvestmentInput,
                        investment,
                        onInvestmentChange,
                        onInvestmentEnter,
                        onInvestmentChangeClick
                    }) {
    return showInvestmentInput ?
        <InputNumber
            value={investment}
            onChange={onInvestmentChange}
            onPressEnter={onInvestmentEnter}
            autoFocus={true}
        /> :
        <a onClick={onInvestmentChangeClick}>{investment}</a>
}

export default Investment;
