import {Select} from "antd";
import React from "react";
import coinlist from '../fixtures/coinlist';

const {Option} = Select;

function Coin({showCoinSelect, coin, onCoinSelect, onCoinChangeClick}) {
    return showCoinSelect ?
        <Select
            defaultValue={coin} open={true}
            onSelect={onCoinSelect}
        >
            {coinlist.map((item) => (
                <Option
                    key={item}
                    value={item}>
                    {item}
                </Option>))}
        </Select> : <a onClick={onCoinChangeClick}>{coin}</a>;
}

export default Coin;
