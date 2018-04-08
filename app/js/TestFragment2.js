/**
 * Created by wonders‘daili on 2018/1/29.
 */
import Fragment from "./base/Fragment";
export default class TestFragment extends Fragment {
    constructor(parent) {
        super(parent);
        this.pageHtml = "./testPage2.html";
        this.fragmentName = "测试页2";
    }

    onReady(data,parentPage) {
        $("#testContent2").click(function () {
            $.toast("content2");
        })
    }
}