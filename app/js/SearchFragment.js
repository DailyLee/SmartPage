/**
 * Created by wonders‘daili on 2017/12/20.
 */
'use strict';
import {handleAjax} from "./base/Handle$ajax";
import MovieInfoPage from "./MovieInfoPage";
import Fragment from "./base/Fragment";
const config = require('../config.json');
export default class SearchFragment extends Fragment {
    constructor(parent) {
        super(parent);
        this.pageHtml = "./searchFragment.html";
        this.fragmentName = "电影搜索";
    }

    onReady() {
        let url = config.douBanMovieUrl;
        //let url = "https://api.douban.com/v2/movie/search";
        let start = 0;
        let subjects = [];
        let dataLength;
        let $searchInput = $("#searchText");
        let $listWrap = $("#listWrap");
        let $loadMore = $("#loadMore");
        let $noMoreData = $("#noMoreData");
        let $resultList = $("#resultList");
        let isLoadMore = false;  //更多加载状态标记

        let currentState = history.state;
        if (currentState) {
            addCells(currentState);
        }

        $("#searchForm").submit(function () {
            start = 0;
            console.log("submit");
            load($searchInput.val(), start, 20);
            return false;
        });

        $listWrap.pullToRefresh({
            onRefresh: function () {
                console.log('refresh');
                start = 0;
                load($searchInput.val(), start, 20);
                $listWrap.pullToRefreshDone();
            },
            onPull: function (percent) {
                //$listWrap.pullToRefreshDone();
            }
        });

        $listWrap.infinite().on("infinite", function () {
            if (isLoadMore || $noMoreData.is(':visible')) return;
            isLoadMore = true;
            start += dataLength;
            $loadMore.show();
            load($searchInput.val(), start, 20);
            console.log('loadMore');
        });

        function load(value, start, count) {
            handleAjax(url, {
                apikey: "0b2bdeda43b5688921839c8ecb20399b",
                city: value,
                start: start,
                count: count
            }, function () {
                if (!isLoadMore) {
                    $.showLoading(config.greetText);
                    $resultList.empty();
                    subjects.length = 0;
                    dataLength = 0;
                }
                $noMoreData.hide();
            })
                .done(function (data) {
                    // 请求成功后要做的工作
                    dataLength = data.length;
                    subjects = subjects.concat(data);
                    if (dataLength > 0) {
                        addCells(subjects);
                    } else {
                        $noMoreData.show();
                    }
                    console.log('done');
                })
                .fail(function (err) {
                    // 请求失败后要做的工作
                    $.toast('fail:' + err, 2000);
                    console.log('fail: ' + err);
                })
                .always(function () {
                    // 不管成功或失败都要做的工作
                    isLoadMore = false;
                    $.hideLoading();
                    $loadMore.hide();
                    if (!isLoadMore) {
                        //history.replaceState(subjects, "subjects", "#city=" + $searchInput.val());
                    }
                    console.log('complete');
                });
        }

        function addCells(subjects) {
            for (let i = start; i < subjects.length; i++) {
                $resultList.append('<a class="weui-cell weui-cell_access"  href="javascript:;">' +
                    '<div class="weui-cell__bd">' +
                    '<p>' + subjects[i].title + '</p>' +
                    '</div>' + '<div class="weui-cell__ft">' +
                    '</div>' +
                    '</a>'
                );
                $("div#resultList .weui-cell").off().click(function () {
                    let index = $(this).index();
                    let subject = subjects[index];
                    new MovieInfoPage().openPage(false, subject);
                    /*localStorage.moviename = subjects[index].title;
                     localStorage.movieimg = subjects[index].images.small;
                     localStorage.msg = subjects[index].pubdates[0];*/
                    //startMovieInfo(subjects[index]);
                    //$(window).attr('location', '/movieInfoPage.html');
                });
            }
        }
    }
}