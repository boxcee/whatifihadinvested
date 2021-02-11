import {Select} from "antd";
import React from "react";

const {Option} = Select;

function Currency({
                      showCurrencyInput,
                      currency,
                      onCurrencySelect,
                      onCurrencyChangeClick
                  }) {
    return showCurrencyInput ?
        <Select
            defaultValue={currency} open={true}
            onSelect={onCurrencySelect}
        >
            {['EUR', 'USD'].map((currency) => (
                <Option
                    key={currency}
                    value={currency}>
                    {currency}
                </Option>))}
        </Select> :
        <a onClick={onCurrencyChangeClick}>{currency}</a>;
}

export default Currency;
