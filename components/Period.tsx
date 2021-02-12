import {Select} from 'antd';

const {Option} = Select;

const periods = {
    'days': [1, 2, 3, 4, 5, 6, 7],
    'weeks': [1, 2, 3, 4],
    'months': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    'years': new Array(30).fill(null).map((n, i) => i)
}

function Period({
                    period,
                    recurring,
                    count,
                    showCountSelect,
                    showPeriodSelect,
                    onCountChangeClick,
                    onCountSelect,
                    onPeriodChangeClick,
                    onPeriodSelect
                }) {
    if (recurring === 'once') {
        return null;
    }

    const possibleCounts = periods[period];

    return (
        <>
            &nbsp;
            {showCountSelect
                ? <Select
                    defaultValue={count}
                    open={true}
                    onSelect={onCountSelect}
                >
                    {possibleCounts
                        .map(c => (
                            <Option
                                key={c}
                                value={c}
                            >
                                {c}
                            </Option>))
                    }
                </Select>
                : <a onClick={onCountChangeClick}>{count}</a>}
            &nbsp;
            {showPeriodSelect
                ? <Select
                    defaultValue={period}
                    open={true}
                    onSelect={onPeriodSelect}
                >
                    {Object.keys(periods).map(p => (
                        <Option
                            key={p}
                            value={p}
                        >
                            {p}
                        </Option>
                    ))}
                </Select>
                : <a onClick={onPeriodChangeClick}>{period}</a>}
        </>
    );
}

export default Period;
