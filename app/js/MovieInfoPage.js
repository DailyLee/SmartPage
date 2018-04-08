/**
 * Created by wonders‘daili on 2018/1/29.
 */
import Page from "./base/Page";
import MorePage from "./MorePage";
export default class MovieInfoPage extends Page {
    constructor() {
        super();
        this.pageHtml = "./movieInfoPage.html";
        this.pageName = "电影详情"
    }

    onReady(data) {
        $("#moreInfo").click(function () {
            //window.history.back();
            new MorePage().openPage(true);
        });
        if (data) {
            $("#title").html(data.title);
            $("#img").attr("src", data.images.small);
            $("#msg").html(data.pubdates[0]);
        }
    }
}

