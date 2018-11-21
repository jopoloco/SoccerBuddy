import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";

var brandPrimary = "#397ab1";

export default (customTheme = createMuiTheme({
	palette: {
		type: "light", // dark
		primary: purple,
		secondary: green
	},
	status: {
		danger: "orange"
	},
	typography: {
		useNextVariants: true,
		fontSize: 25,
		headline: {
			fontSize: 27,
			flexBasis: "50%",
			flexShrink: 0,
			color: "black",
			fontWeight: "400"
		},
		subtitle1: {
			fontSize: 16,
			color: "black"
		},
		body1: {
			fontSize: 16
		}
	}
}));
