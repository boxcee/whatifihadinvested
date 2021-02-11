import {Select} from "antd";
import React from "react";

const {Option} = Select;

function Recurring({recurring, showRecurringSelect, onRecurringSelect, onRecurringChangeClick}) {
    return showRecurringSelect ? <Select
        defaultValue={recurring} open={true}
        onSelect={onRecurringSelect}
    >
        {['once', 'every'].map((item) => (
            <Option
                key={item}
                value={item}>
                {item}
            </Option>))}
    </Select> : <a onClick={onRecurringChangeClick}>{recurring}</a>;
}

export default Recurring;
