import fetch from "node-fetch";
const API_ENDPOINT =
  "https://cfrkftig71.execute-api.us-east-1.amazonaws.com/prod?expert=true";

var urls = [];

const urlNode = async (url) => {
  const content = await fetch(url);
  const binaryData = await content.blob();
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  return {
    "url": url,
    "file_name": fileName,
    "binary_data": binaryData,
  };
};

async function recursiveTraverse(object) {
  if (object instanceof Object) {
    for (var key of Object.keys(object)) {
      if (object[key] instanceof Object) {
        recursiveTraverse(object[key]);
      } else {
        const url = object[key];
        urls.push(await urlNode(url));
        return;
      }
    }
  }
}

async function fetchUrls() {
  const res = await fetch(API_ENDPOINT);
  const json = await res.json();
  for (const key of json) {
    if (key instanceof Object) {
      recursiveTraverse(key);
    } else {
      urls.push(await urlNode(key));
    }
  }
  return urls;
}

export async function start() {
  try {
    return await fetchUrls();
  } catch (error) {
    console.log("Failed! " + error);
    return null;
  }
}

