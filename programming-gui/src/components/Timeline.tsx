/* eslint-disable no-console */
import React, { Component } from "react";
import moment from "moment-timezone";
import Day from "./Day";

// Using UTC because there's no need to deal with timezones in this UI
moment.tz.setDefault('Etc/UTC');

interface IProps {
    data: any;
    setData: (data: any) => void
}

function TLine(props: IProps) {
    const [groups, setGroups] = React.useState<any>([]);
    const [numDays, setNumDays] = React.useState<number>(2);
    const [currId, setCurrId] = React.useState<number>(1);

    const DAY = 86400000;

    const items = props.data || [];

    React.useEffect(() => {
        const group_names = ["R", "G", "W"];
        let groupsInitial = [] as any;
        for (let i = 0; i < group_names.length; i++) {
            groupsInitial.push({
                id: i,
                title: group_names[i]
            })
        }
        setGroups(groupsInitial);
    }, []);

    const removeDay = (dayNumber) => {
        const dayStart = DAY * dayNumber;
        const dayEnd = dayStart + DAY;

        let filteredData = props.data.filter(item =>
            item.start < dayStart || item.start > dayEnd
        );
        filteredData = filteredData.map(item => {
            //move later days up
            if (item.start > dayStart) {
                item.start -= DAY;
                item.end -= DAY;
            }
            return item;
        })

        props.setData(filteredData);
        setNumDays(numDays - 1);
    }

    const moveDayDown = (dayNumber) => {
        const dayGoingDownStart = DAY * dayNumber;
        const dayBoundary = dayGoingDownStart + DAY;
        const dayGoingUpEnd = dayBoundary + DAY

        const newData = props.data.map(item => {
            if (item.start > dayGoingDownStart && item.end < dayBoundary) {
                item.start += DAY;
                item.end += DAY;
            }
            else if (item.start > dayBoundary && item.start < dayGoingUpEnd) {
                item.start -= DAY;
                item.end -= DAY;
            }
            return item;
        })

        props.setData(newData);
    }

    const days = [...Array(numDays).keys()];

    return <div>
        {days.map(i =>
            <Day
                items={items}
                groups={groups}
                setData={props.setData}
                dayNumber={i}
                removeDay={removeDay}
                currId={currId}
                setCurrId={setCurrId}
                moveDayDown={moveDayDown}
                key={i}
            />
        )}
        <div id="add-day-button">
            <button onClick={() => { setNumDays(numDays + 1) }}>
                <img src="./images/plusbutton.svg" alt="Add Day" />
            </button>
        </div>
    </div>
}


export default TLine;