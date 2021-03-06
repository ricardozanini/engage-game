(function () {
    'use strict';

    /*global angular, _*/
    angular.module('leaderboard', ['ordinal'])
        .directive('plLeaderboard', leaderboard)
        .factory('leaderboardservice', leaderboardservice);

    leaderboardservice.$inject = ['$http'];
    LeaderboardController.$inject = ['$scope', '$interval', 'leaderboardservice'];

    var serviceUrl = 'http://localhost:1337/parse/classes/leaders',
        maxLeaders = 10,
        updateInterval = 5000;

    function leaderboard() {
        var directive = {
            restrict: 'AE',
            templateUrl: 'leaderboard.html',
            controller: LeaderboardController,
            controllerAs: 'vm'
        };

        return directive;
    }

    function leaderboardservice($http) {
        return {
            getLeaders: getLeaders
        };

        function getLeaders() {
            return $http.get(
                `${serviceUrl}?limit=1000`,
                {
                    headers: {
                        'X-Parse-Application-Id': 'ENGAGE'
                    },
                })
                .then(getLeadersComplete)
                .catch(getLeadersFailed);

            function getLeadersComplete(response) {
              console.log("getLeadersComplete");
                const leaders = _(response.data.results)
                    .sortBy('score')
                    .reverse()
                    .uniqBy('name')
                    .take(10)
                    .value();

                return leaders;
            }

            function getLeadersFailed(error) {
                /*
                 * there was an error
                 */
                console.error(error);
            }
        }
    }

    function LeaderboardController($scope, $interval, leaderboardservice) {
        var vm = this;
        vm.leaders = [];
        console.log("controller");

        $interval(getLeaders, updateInterval);
        getLeaders();

        $scope.$watch("vm.leaders", function (newLeaders, oldLeaders) {
          console.log(newLeaders, oldLeaders);

          if (!newLeaders.length || !oldLeaders.length){
            return;
          }

          newLeaders.forEach(function (leader, index) {
            if (leader.name !== oldLeaders[index].name) {
              leader.animate = true;
            }
          })

        }, true);

        function getLeaders() {
            return leaderboardservice.getLeaders()
                .then(function (data) {
                    vm.leaders = data;
                    return vm.leaders;
                });
        }
    }
}());
