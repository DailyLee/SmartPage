/**
 * Created by wonders‘daili on 2017/12/20.
 */
import MainPage from "./MainPage";
$(function () {
    FastClick.attach(document.body);
    new MainPage().openPage(false);
});
