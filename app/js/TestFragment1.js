/**
 * Created by wonders‘daili on 2018/1/29.
 */
import TestFragment2 from "./TestFragment2";
import Fragment from "./base/Fragment";
export default class TestFragment1 extends Fragment {
    constructor(parent) {
        super(parent);
        this.pageHtml = "./testPage1.html";
        this.fragmentName = "测试页1";
    }

    onReady(data, parentPage) {
        $("#testContent1").off().click(function () {
            //$.toast("test click");
            new TestFragment2($("#fromPage")).addToBackStack().attach(parentPage);
            //new TestFragment2($("#fromPage")).attach(parentPage);
        })

    }
}

