angular.module('googleAnalytics', []);
angular.module('googleAnalytics').run(function ($rootScope, $interval, analyticsOptions) {
	if(analyticsOptions.hasOwnProperty("enabled") && analyticsOptions.enabled) {
		if(analyticsOptions.hasOwnProperty("siteId") && analyticsOptions.siteId != '') {
			if(typeof ga === 'undefined') {
				(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

				ga('create', analyticsOptions.siteId, {'alwaysSendReferrer': true});
				ga('set', 'anonymizeIp', true);
			}
		}
		$rootScope.$on('$locationChangeSuccess', function (event, toState, fromState) {
			if(analyticsOptions.hasOwnProperty("defaultTitle")) {
				var documentTitle = analyticsOptions.defaultTitle;
				var interval = $interval(function () {
					if(document.title !== '') documentTitle = document.title;
					if (window.location.pathname.indexOf('openurl') !== -1 || window.location.pathname.indexOf('fulldisplay') !== -1)
						if (angular.element(document.querySelector('prm-full-view-service-container .item-title>a')).length === 0) return;
						else documentTitle = angular.element(document.querySelector('prm-full-view-service-container .item-title>a')).text();
					
					if(typeof ga !== 'undefined') {
						if(fromState != toState) ga('set', 'referrer', fromState);
						ga('set', 'location', toState);
						ga('set', 'title', documentTitle);
						ga('send', 'pageview');
					}
					$interval.cancel(interval);
				}, 0);
			}
		});
	}
});
angular.module('googleAnalytics').value('analyticsOptions', {
	enabled: true,
	siteId: '',
	defaultTitle: ''
});