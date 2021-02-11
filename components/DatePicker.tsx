import {DatePicker as DP} from 'antd';

const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

function DatePicker({showDateSelect, date, onDateChange, onDateChangeClick}) {
    return showDateSelect ? <DP onChange={onDateChange} open={true} /> :
        <a onClick={onDateChangeClick}>{date.toLocaleDateString(undefined, options)}</a>;
}

export default DatePicker;
