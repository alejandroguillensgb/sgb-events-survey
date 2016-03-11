'use strict';

angular.module('sgb-events-survey', ['megazord'])
    .controller('sgb-events-survey-controller', ['$scope', '_router', '_screen', '_screenParams','appConstants','_data','$ionicPopup','$appLoader','SurveyQuestions','$appAlert',
    	function ($scope, _router, _screen, _screenParams, appConstants, _data, $ionicPopup, $appLoader, SurveyQuestions, $appAlert) {
        _screen.initialize($scope, _screenParams);
        $scope.surveyInfo = _data;
        var questionsAnswers  = []; 
        $scope.optionSelected = function(questionId, optionId){
            questionsAnswers[questionId] = optionId;
        };
    	$scope.isOptionSelected = function() {
        	return (Object.keys(questionsAnswers).length > 0);
    	}

    	$scope.submitAnswers = function(){
            var answersArray = [];
            for (var key in questionsAnswers) {
                var answer = {
                    userId: '1111',
                    questionId: key,
                    optionId: questionsAnswers[key]
                }
                answersArray.push(answer);
            }

            $appLoader.show();
            SurveyQuestions.submit(answersArray).then(function(data){
                $scope.surveyResponse   = data;
                $scope.submitSuccess    = ($scope.surveyResponse.status == 'OK');
                $scope.serviceMessage   = $scope.surveyResponse.msg;
                $appLoader.hide();
                $appAlert.show($scope.serviceMessage);
            });
        };

    	$scope.showAlert = function() {
            var confirmPopup = $ionicPopup.confirm({
               title   : '¿Desea continuar?',
               template: 'Una vez envíadas sus respuestas no podrá modificarlas.',
               cancelText: 'No',
               okText: 'Si', 
             });
             confirmPopup.then(function(res) {
                if(res) {
                    $scope.submitAnswers();
                } else {
                    return;
                }
             });  
        };


    }]);