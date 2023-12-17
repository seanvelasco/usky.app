import type { JSX } from "solid-js";

const Avatar = (
	props: {
		src?: string;
		alt?: string;
		size?: string;
		style?: JSX.CSSProperties;
	} = { size: "3.5rem" },
) => {
	props.size = props.size ?? "3rem";
	return (
		<img
			loading="lazy"
			draggable="false"
			// style:border-radius={shape === "round" ? "50%" : "12px"}
			src={props.src ?? "/avatar.svg"}
			alt={props.alt ?? "Default avatar"}
			style={{
				width: props.size,
				height: props.size,
				"vertical-align": "middle",
				"object-fit": "cover",
				"border-radius": "50%",
				...props.style,
			}}
		/>
	);
};

export default Avatar;
