/**
 * Created by wonders‘daili on 2018/1/29.
 */
import Page from "./base/Page";
import SearchFragment from "./SearchFragment";
import FromFragment from "./FromFragment";
import Fragment from "./base/Fragment";
let mainPage;
export default class MainPage extends Page {
    constructor(parent) {
        super(parent);
        this.pageHtml = "./mainPage.html";
        this.pageName = $("title").html();
        mainPage = this;
    }

    onReady() {
        weui.tab('#tab', {
            defaultIndex: 0,
            onChange: function (index) {
                Fragment.clearFragments(mainPage);
                let $title = $("title");
                switch (index) {
                    case 0:
                        $title.html("电影搜索");
                        break;
                    case 1:
                        $title.html("表单页");
                        let $fromPage = $("#fromPage");
                        if ($fromPage.children().length === 0) {
                            new FromFragment($fromPage).addToBackStack().attach(mainPage);
                        }
                        break;
                    case 2:
                        $title.html("上传页");
                        break;
                    case 3:
                        $title.html("其他页");
                        break;
                    case 4:
                        $title.html("个人页");
                        break;
                }
            }
        });
        new SearchFragment($("#searchPage")).addToBackStack().attach(mainPage);
    }
}