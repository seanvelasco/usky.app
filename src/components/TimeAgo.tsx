const ranges: { [key: string]: number } = {
	year: 3600 * 24 * 365,
	month: 3600 * 24 * 30,
	week: 3600 * 24 * 7,
	day: 3600 * 24,
	hour: 3600,
	minute: 60,
	seconds: 1,
	millisecond: 0.001,
};

const shortcut: { [key: string]: string } = {
	year: "y",
	month: "m",
	week: "w",
	day: "d",
	hour: "h",
	minute: "m",
	seconds: "s",
	millisecond: "ms",
};

const timeAgo = (date: Date) => {
	const secondsElapsedAbs = Math.abs((date.getTime() - Date.now()) / 1000);

	for (const key in ranges) {
		if (ranges[key] < secondsElapsedAbs) {
			const delta = secondsElapsedAbs / ranges[key];
			return Math.round(delta).toString() + shortcut[key];
		}
	}
};

const TimeAgo = (props: { time: Date }) => {
	return (
		<time
			datetime={props.time.toLocaleString()}
			style={{
				color: "var(--text-secondary)",
				cursor: "default",
				"font-size": "0.875rem",
				"white-space": "nowrap",
			}}
		>
			{timeAgo(props.time)}
		</time>
	);
};

export default TimeAgo;
