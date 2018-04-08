/**
 * Created by wonders‘daili on 2018/1/31.
 */
import Page from "./Page";
let fragmentStackOfPage = new Map();
let fragmentsOfPage = new Map();
export default class Fragment {
    constructor(parentDiv) {
        this.parentDiv = parentDiv;
        this.isPushStack = false;
    }

    addToBackStack() {
        this.isPushStack = true;
        history.pushState(null, "state", "#a=" + this.fragmentName);
        return this;
    }

    attach(parentPage, data) {
        if (!(parentPage instanceof Page)) {
            throw Error("fragment must have js parent");
        }
        if (!fragmentStackOfPage.get(parentPage.pageName)) {
            fragmentStackOfPage.set(parentPage.pageName, []);
        }
        if (!fragmentsOfPage.get(parentPage.pageName)) {
            fragmentsOfPage.set(parentPage.pageName, []);
        }
        this.fragmentStack = fragmentStackOfPage.get(parentPage.pageName);
        this.fragments = fragmentsOfPage.get(parentPage.pageName);
        this.lastStackPage = this.fragmentStack[this.fragmentStack.length - 1];

        this.lastPage = this.parentDiv.children().first();
        this.parentDiv.prepend('<div style="height: 100%;width: 100%">' + '</div>');
        this.currentPage = this.parentDiv.children().first();

        if (this.isPushStack) {
            this.fragmentStack.push(this.currentPage);
            this.fragments.push(this);
        }
        parentPage._addFragment(this.fragments);
        parentPage._currentFragment(this);
        this._loadHtml(data, parentPage);
    }

    _loadHtml(data, parentPage) {
        let onReady = this.onReady;
        let fragmentName = this.fragmentName;

        if (this.lastStackPage && this.lastStackPage.html() == this.lastPage.html()) {
            //上一个页面在栈中hide
            this.lastPage.hide();
            //console.log("last js hide");
        } else {
            //上一个页面不在栈中remove
            //console.log("last js remove");
            this.lastPage.remove();
        }

        this.currentPage.show("slow");
        this.currentPage.load(this.pageHtml, function (responseTxt, statusTxt, xhr) {
            if (statusTxt === "success") {
                if (onReady) {
                    onReady(data, parentPage);
                    console.log(fragmentName + " 页面加载成功");
                } else {
                    throw Error(fragmentName + " onReady not find!");
                }
            }
            if (statusTxt === "error")
                console.log(fragmentName + " 页面加载失败，Error: " + xhr.status + ": " + xhr.statusText);
        });
    }

    static clearFragments(page) {
        fragmentsOfPage.get(page.pageName).length = 0;
    }

    onpopstate(event) {
        //console.log("fragmentName" + this.fragmentName);
        if (this.isPushStack) {
            //console.log("in stack pop");
            this.fragmentStack.pop().remove();
        } else {
            //console.log("not in stack remove"+ this.currentPage.html());
            this.currentPage.remove();
        }
        //console.log("fragment stack length" + this.fragmentStack.length);
        if (this.fragmentStack.length > 0) {
            //console.log("fragment show" + this.fragmentStack[this.fragmentStack.length - 1].html());
            this.fragmentStack[this.fragmentStack.length - 1].show("fast");
        }
    }
}