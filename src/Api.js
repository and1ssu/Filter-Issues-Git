const BASEAPI = 'https://api.github.com/repos/facebook/react/issues?state=all';
const URILABEL = 'https://api.github.com/repos/facebook/react/labels';

const exportObject = {
  
    getIssues : async () => {
        const res = await fetch(BASEAPI);
        const json = await res.json();
        return json;
    },

    getLabel : async () => {
        const res = await fetch(URILABEL);
        const json = await res.json();
        return json;
    }


};

export default exportObject;