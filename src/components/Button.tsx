import { JSX, JSXElement } from 'solid-js'
import styles from './Button.module.css'

const Button = (props: { children: JSXElement, style?: JSX.CSSProperties }) => <button type="button" class={styles.button} style={props.style}>{props.children}</button>

export default Button