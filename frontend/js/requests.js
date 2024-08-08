const fetchData = async function(route, ...parameters) {
    let url = route;
    if(parameters){
        url = addParameters(route, parameters);
    }
    console.log('url:' + url);
    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error('El recurso no pudo ser accedido: ' + url);
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error(error);
    }
};

const postData = async function(route, data, ...parameters) {
    let url = route;
    if(parameters){
        url = addParameters(route, parameters);
    }
    console.log('url: ' + url);
    console.log('data: ' + data);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };    
    try{
        const response = await fetch(url, options);
        if(!response.ok){
            throw new Error('El recurso no pudo ser accedido: ' + url);
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error(error);
    }
}

const addParameters = function(route, parameters){
    let url = route;
    parameters.forEach((parameter) => {
        url += '/' + parameter;
    });
    return url;
}

export {fetchData, postData};
