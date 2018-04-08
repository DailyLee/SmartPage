/**
 * Created by wonders‘daili on 2018/1/9.
 */
export function handleAjax(url, param, beforeSend, type, dataType) {
    return ajax(url, param, beforeSend, type, dataType).then(function (resp) {
        if (resp.title) {
            if (resp.subjects) {
                return resp.subjects;
            }
            return [];
        } else {
            return $.Deferred().reject(resp.msg);
        }
    }, function (err) {
        console.log("err: " + err.status);
    })
}

function ajax(url, param, beforeSend, type, dataType) {
    return $.ajax({
        url: url,
        data: param || {},
        method: type || "GET",
        dataType: dataType || "JSONP",
        timeout: 10000,
        beforeSend: beforeSend
    })
}