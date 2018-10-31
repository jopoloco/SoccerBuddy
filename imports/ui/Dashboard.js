import React from "react";

import PrivateHeader from "./PrivateHeader";
import SearchResults from "./SearchResults";
import Sidebar from "./Sidebar";

export default () => {
    return (
        <div>
            <PrivateHeader title="Ebay Buddy" />
            <div className="pageContent">
                <div className="pageContent-sidebar">
                    <Sidebar />
                </div>
                <div className="pageContent-main">
                    <SearchResults />
                </div>
            </div>
        </div>
    );
};
