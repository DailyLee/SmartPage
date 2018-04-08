/**
 * Created by wonders‘daili on 2018/1/29.
 */
let pageStack = [];
let pageTitles = [];
let pageNames = [];
let fragmentsInPage = new Map();
let currentFragmentInPage = new Map();
export default class Page {
    constructor() {
        this.parentDiv = $("body");
    }

    openPage(popStack, data) {
        if (!this.pageName) {
            throw Error("js must have pageName!");
        }
        for (let i in pageNames) {
            if (pageNames[i] === this.pageName) {
                throw Error("this pageName must be different with other pageName!");
            }
        }
        if (popStack) {
            history.replaceState(data, "state", "#a=" + this.pageName);
            pageStack.pop().remove();
        } else {
            history.pushState(data, "state", "#a=" + this.pageName);
            pageNames.push(this.pageName);
            pageTitles.push($("title").html());
        }
        this.lastPage = this.parentDiv.children().first();
        this.parentDiv.prepend('<div style="height: 100%;width: 100%">' + '</div>');
        this.currentPage = this.parentDiv.children().first();
        pageStack.push(this.currentPage);
        $("title").html(this.pageName);
        this._loadHtml(data);
    }

    _loadHtml(data) {
        let onReady = this.onReady;
        let pageName = this.pageName;
        this.lastPage.hide();
        this.currentPage.show("slow");
        this.currentPage.load(this.pageHtml, function (responseTxt, statusTxt, xhr) {
            if (statusTxt === "success") {
                if (onReady) {
                    onReady(data);
                    console.log(pageName + " 页面加载成功");
                } else {
                    throw Error(pageName + " onReady not find!");
                }
            }
            if (statusTxt === "error")
                console.log(pageName + " 页面加载失败，Error: " + xhr.status + ": " + xhr.statusText);
        });
    }

    _addFragment(fragments) {
        fragmentsInPage.set(this.pageName, fragments);
    }

    _currentFragment(fragment) {
        currentFragmentInPage.set(this.pageName, fragment);
    }

    getFragments(pageName) {
        return fragmentsInPage.get(pageName);
    }
}

$(function () {
    window.onpopstate = function (event) {
        let name = pageNames.pop();
        let currentFragment = currentFragmentInPage.get(name);
        let fragments = fragmentsInPage.get(name);
        if (currentFragment && !currentFragment.isPushStack) {
            fragments.push(currentFragment);
            //history.pushState(null, "state", "#a=" + currentFragment.fragmentName);
            console.log("current fragment push" + currentFragment.fragmentName);
            currentFragmentInPage.set(name, false);
        }
        //console.log("length" + fragments.length);
        if (fragments && fragments.length > 1) {
            pageNames.push(name);
            fragments.pop().onpopstate(event);
            //console.log("fragment pop");
        } else {
            //console.log("js pop");
            if (pageStack.length === 1) {
                /* window.opener = null;
                 window.open('', '_self');
                 window.close();*/
                $.confirm("即将返回微信", function () {
                    //点击确认后的回调函数
                    WeixinJSBridge.call('closeWindow');
                }, function () {
                    pageNames.push(name);
                    if (currentFragment && !currentFragment.isPushStack) {
                        fragments.pop();
                    }
                    history.pushState(null, "state", "#a=" + currentFragment.pageName);
                });
            } else {
                pageStack.pop().remove();
                pageStack[pageStack.length - 1].show("fast");
                $("title").html(pageTitles.pop());
            }
        }
    };
});