import React from "react";

import SearchResults from "./SearchResults";
import Sidebar from "./Sidebar";

export default () => {
	return (
		<div className="pageContent">
			<div className="pageContent-sidebar">
				<Sidebar />
			</div>
			<div className="pageContent-main">
				<SearchResults />
			</div>
		</div>
	);
};
