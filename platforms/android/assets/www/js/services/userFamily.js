angular.module('starter')

.factory('UserFamily', function ($q) {

    return {
//funkcja get tworzy deferer i zwraca promise        
        get: function (userId) {

//odroczenie dla obiektu def dopóki nie będzie resolve
            var def = $q.defer();

            var FamilyMembers = [];
            var ref = new Firebase("https://geofamily.firebaseio.com/users/" + userId + "/familyNick");
                
//funkcja asynchroniczna            
            ref.on("value", function (snapshot) {
                var familyNick = snapshot.val();

                var refAll = new Firebase("https://geofamily.firebaseio.com/users");
                var query = refAll.orderByChild("familyNick").equalTo(familyNick);

                query.on("child_added", function (membersSnapshot) {

                    var displayName = membersSnapshot.val().displayName;
                    var profileImage = membersSnapshot.val().profileImage;
                    var long = membersSnapshot.val().location.long;
                    var lat = membersSnapshot.val().location.lat;

                    FamilyMembers.push({
                        displayName, profileImage, long, lat
                    });

                    def.resolve(FamilyMembers);

                });
            });
//zwracanie obietnicy odpowiedzi
            return def.promise;

        }
    }
});