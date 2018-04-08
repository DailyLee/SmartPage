/**
 * Created by wonders‘daili on 2018/1/29.
 */
import Fragment from "./base/Fragment";
import TestFragment1 from "./TestFragment1";
export default class FromFragment extends Fragment {
    constructor(parent) {
        super(parent);
        this.pageHtml = "./fromFragment.html";
        this.fragmentName = "表单页";
    }

    onReady(data,parentPage) {
        $("#fromContent").off().click(function () {
            //$.toast("more click");
            new TestFragment1($("#fromPage")).addToBackStack().attach(parentPage);
        })
    }
}