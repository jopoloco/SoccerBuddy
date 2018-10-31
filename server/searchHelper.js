// imports
import { Meteor } from "meteor/meteor";
import { Searches } from "../imports/api/searches";
import { SearchResults } from "../imports/api/searchResults";
import axios from "axios";
import { sendSMS } from "./twilio_server";

const myAppIdPRD = "JohnPort-ebuddyte-PRD-493587284-7d44da0e";
// const myAppIdSBX = "JohnPort-ebuddyte-SBX-9820bcb98-34894b35";

const MAX_PAGES = 3;

function buildURLArray(filterArray) {
	var urlFilter = "";
	// Iterate through each filter in the array
	for (var i = 0; i < filterArray.length; i++) {
		//Index each item filter in filterArray
		var itemfilter = filterArray[i];
		// Iterate through each parameter in each item filter
		for (var index in itemfilter) {
			// Check to see if the paramter has a value (some don't)
			if (itemfilter[index] !== "") {
				if (itemfilter[index] instanceof Array) {
					for (var r = 0; r < itemfilter[index].length; r++) {
						var value = itemfilter[index][r];
						urlFilter +=
							"&itemFilter(" +
							i +
							")." +
							index +
							"(" +
							r +
							")=" +
							value;
					}
				} else {
					urlFilter +=
						"&itemFilter(" +
						i +
						")." +
						index +
						"=" +
						itemfilter[index];
				}
			}
		}
	}

	return urlFilter;
} // End buildURLArray() function

// search
export async function PerformSearch(_id, trueSearch) {
	console.log("compiling search");
	var response = { results: [], error: "", total: 0 };

	var search = Searches.findOne({ _id: _id });

	if (!search) {
		return "nothing found";
	}

	// Create a JavaScript array of the item filters you want to use in your request
	var conditionArray = [];
	var listingArray = [];

	conditionArray.push("New");
	conditionArray.push("Used");

	if (search.auction) {
		listingArray.push("Auction");
	}
	if (search.auctionBIN) {
		listingArray.push("AuctionWithBIN");
	}
	if (search.fixedPrice) {
		listingArray.push("FixedPrice");
	}

	var filterArray = [
		{
			name: "MaxPrice",
			value: search.price,
			paramName: "Currency",
			paramValue: "USD"
		},
		{
			name: "Condition",
			value: conditionArray,
			paramName: "",
			paramValue: ""
		},
		{
			name: "ListingType",
			value: listingArray,
			paramName: "",
			paramValue: ""
		}
	];

	var urlFilter = buildURLArray(filterArray);

	var url = "http://svcs.ebay.com/services/search/FindingService/v1";
	url += "?OPERATION-NAME=findItemsAdvanced";
	url += "&SERVICE-VERSION=1.0.0";
	url += "&SECURITY-APPNAME=" + myAppIdPRD;
	url += "&GLOBAL-ID=EBAY-US";
	url += "&RESPONSE-DATA-FORMAT=JSON";
	// url += "&callback=_cb_findItemsByKeywords";
	url += "&REST-PAYLOAD";
	url += "&keywords=" + encodeURI(search.title);
	url += "&paginationInput.entriesPerPage=250";
	// url += "&paginationInput.pageNumber=" + pageValue // use this to grab next page
	url += "&outputSelector=PictureURLLarge";
	url += "&outputSelector(2)=PictureURLSuperSize";
	url += urlFilter; // need to set this up after creating editor fields

	var errMsg = "";
	var pages = 0;

	await axios
		.get(url, {
			crossDomain: true,
			headers: { "Access-Control-Allow-Origin": "*" }
		})
		.then((temp) => {
			console.log("setting up manager");
			var res = temp.data.findItemsAdvancedResponse[0];

			if (res.ack[0] == "Failure") {
				var err = res.errorMessage[0].error[0];
				errMsg =
					"Failed to obtain results: Error Id: " + err.errorId[0];
				errMsg += "; Error message" + err.message[0];
				throw new Meteor.Error(errMsg);
			} else if (res.searchResult[0].item == undefined) {
				errMsg = "Search was successful, but no results were found.";
				throw new Meteor.Error(errMsg);
			}

			pages = res.paginationOutput[0].totalPages[0];
			response.total = res.paginationOutput[0].totalEntries[0];
		})
		.catch((error) => {
			console.log(error);
			response.error = error;
			throw new Meteor.Error("API call error: " + error);
		});

	if (pages > MAX_PAGES) {
		response.error =
			"Search yielded too many results; Results will not be indexed; Please restrict search and try again";
		pages = MAX_PAGES;
	}

	if (!trueSearch) {
		pages = 1;
	}

	for (var i = 1; i <= pages; i++) {
		var newUrl = url + "&paginationInput.pageNumber=" + i; // use this to grab next page
		var pageItems = await GetItemsFromUrl(newUrl);
		response.results = response.results.concat(pageItems);
	}

	return response;
}

// searchResults
export async function UpdateSearchResults(searchId, items) {
	if (!items || items.length <= 0) {
		console.log("invalid item array received. bailing...");
		return;
	}

	console.log("Updating results with length: " + items.length);

	var newItems = items;
	var newIds = items.map(function(item) {
		return item.itemId;
	});
	var search = Searches.findOne({ _id: searchId });
	var user = Meteor.users.findOne({ _id: search.userId });
	var curItems = SearchResults.findOne({ searchId }).items;
	var curIds = curItems.map(function(item) {
		return item.itemId;
	});
	var addedItems = [];

	console.log("search: " + search.title);

	if (curIds.length > 0) {
		console.log("looping through items...");
		var i = 0;
		var item = undefined;

		for (i = 0; i < newIds.length; i++) {
			item = newIds[i];
			if (!curIds.includes(item)) {
				console.log("new item found!");
				addedItems.push(newItems[i]);
			}
		}

		if (addedItems.length > 0) {
			var msg = "Hello! You have " + addedItems.length;
			msg += " new item(s) for your search: ";
			msg += search.title;
			msg += "; email: " + user.emails[0].address;

			sendSMS(msg, user.phoneNumber);

			for (i = 0; i < addedItems.length; i++) {
				// TODO ... send text to user alerting them to the new item;
				item = addedItems[i];
			}
		} else {
			var negMSG =
				"no new items! for search: " +
				search.title +
				"; user: " +
				user.emails[0].address;
			sendSMS(negMSG, user.phoneNumber);
		}
	} else {
		addedItems = newItems;
	}

	console.log(
		"performing actual update with: " + addedItems.length + " items"
	);
	SearchResults.update({ searchId }, { $set: { items: newItems } });
}

async function GetItemsFromUrl(url) {
	var errMsg = "";
	return await axios
		.get(url, {
			crossDomain: true,
			headers: { "Access-Control-Allow-Origin": "*" }
		})
		.then((response) => {
			// process results
			console.log("getting results");
			var res = response.data.findItemsAdvancedResponse[0];
			if (res.ack[0] == "Failure") {
				var err = res.errorMessage[0].error[0];
				errMsg =
					"Failed to obtain results: Error Id: " + err.errorId[0];
				errMsg += "; Error message" + err.message[0];
				throw new Meteor.Error(errMsg);
			} else if (res.searchResult[0].item == undefined) {
				errMsg = "Search was successful, but no results were found.";
				throw new Meteor.Error(errMsg);
			} else {
				var itemArray = res.searchResult[0].item;
				return itemArray.map((item) => {
					return {
						title: item.title[0],
						// subtitle: item.subtitle[0],
						itemId: item.itemId[0],
						image: item.pictureURLLarge
							? item.pictureURLLarge[0]
							: item.pictureURLSuperSize
								? item.pictureURLSuperSize[0]
								: item.galleryURL
									? item.galleryURL[0]
									: null,
						url: item.viewItemURL[0],
						auctionPrice:
							"Price: " +
							item.sellingStatus[0].convertedCurrentPrice[0]
								.__value__,
						buyPrice:
							"Buy: " +
							(item.listingInfo[0].buyItNowAvailable[0] == "true"
								? item.listingInfo[0].convertedBuyItNowPrice[0]
									.__value__
								: "N/A"),
						timeLeft:
							"Time remaining: " +
							item.sellingStatus[0].timeLeft[0],
						condition:
							"Condition: " +
							(item.condition == null
								? "N/A"
								: item.condition[0].conditionDisplayName[0])
					};
				});
			}
		})
		.catch((error) => {
			console.log(error);
			throw new Meteor.Error("API call error: " + error);
		});
}
