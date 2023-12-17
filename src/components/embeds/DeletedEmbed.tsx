import commonStyles from "./Embed.module.css";

const DeletedEmbed = () => {
	return (
		<div
			class={`${commonStyles.embed} ${commonStyles.record}`}
			style={{
				display: "flex",
				"flex-direction": "column",
			}}
		>
			<p>This post is deleted</p>
		</div>
	);
};

export default DeletedEmbed;
