var myApp = angular.module('myApp', ['ng-admin']);
myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var admin = nga.application('Cultural App Dashboard')
      //.baseApiUrl('http://jsonplaceholder.typicode.com/'); // main API endpoint
      .baseApiUrl('https://cultural-api.herokuapp.com/api/');
    // create a user entity
    // the API endpoint for this entity will be 'http://jsonplaceholder.typicode.com/users/:id

    var lugar = nga.entity('lugares').identifier(nga.field('_id'));

    lugar.listView().fields([
        nga.field('title').isDetailLink(true),
        nga.field('tipo')
        ]);

    lugar.creationView().fields([
        nga.field('title'),
        nga.field('description'),
        nga.field('direccion'),
        nga.field('image'),
        nga.field('','template').label('Preview')
                 .template('<img style="width:200px;height:200px;" src="{{ entry.values.image }}"/>'),
        nga.field('latitud'),
        nga.field('longitud'),
        nga.field('qr'),
        nga.field('tipo')

        ]);
    lugar.editionView().fields(lugar.creationView().fields());


    admin.addEntity(lugar);

     var comentario = nga.entity('comentarios').identifier(nga.field('_id'));

    comentario.listView().fields([
        nga.field('nombre').isDetailLink(true),
        nga.field('comentario')
        ]);

    comentario.creationView().fields([
        nga.field('id_lugar'),
        nga.field('foto'),
        nga.field('nombre'),
        nga.field('comentario'),
        nga.field('__v')
        ]);
    comentario.editionView().fields(comentario.creationView().fields());



    admin.addEntity(comentario);

     var favorito = nga.entity('favoritos').identifier(nga.field('_id'));

    favorito.listView().fields([
        nga.field('title').isDetailLink(true),
        nga.field('image')

        ]);

    favorito.creationView().fields([
        nga.field('title'),
        nga.field('image')
        ]);
    favorito.editionView().fields(favorito.creationView().fields());



    admin.addEntity(favorito);
    
 /*  var user = nga.entity('users');
user.listView().fields([
    // use the name as the link to the detail view - the edition view
    nga.field('name').isDetailLink(true),
    nga.field('username'),
    nga.field('email')
]);

user.creationView().fields([
    nga.field('name')
        .validation({ required: true, minlength: 3, maxlength: 100 }),
    nga.field('username')
        .attributes({ placeholder: 'No space allowed, 5 chars min' })
        .validation({ required: true, pattern: '[A-Za-z0-9\.\-_]{5,20}' }),
    nga.field('email', 'email')
        .validation({ required: true }),
    nga.field('address.street')
        .label('Street'),
    nga.field('address.city')
        .label('City'),
    nga.field('address.zipcode')
        .label('Zipcode')
        .validation({ pattern: '[A-Z\-0-9]{5,10}' }),
    nga.field('phone'),
    nga.field('website')
        .validation({ validator: function(value) {
            if (value.indexOf('http://') !== 0) throw new Error ('Invalid url in website');
        } })
]);
// use the same fields for the editionView as for the creationView
user.editionView().fields(user.creationView().fields());
admin.addEntity(user);


     var post = nga.entity('posts');
   var post = nga.entity('posts');
post.listView()
     .fields([
        nga.field('title').isDetailLink(true),
        nga.field('body', 'text')
            .map(function truncate(value) {
                if (!value) return '';
                return value.length > 50 ? value.substr(0, 50) + '...' : value;
            }),
        nga.field('userId', 'reference')
            .targetEntity(user)
            .targetField(nga.field('username'))
            .label('Author')
    ])
    .listActions(['show'])
    .batchActions([])
    .filters([
                nga.field('q')
            .label('')
            .pinned(true)
            .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
        nga.field('userId', 'reference')
            .targetEntity(user)
            .targetField(nga.field('username'))
            .label('User')
    ]);

post.showView().fields([
    nga.field('title'),
    nga.field('body', 'text'),
    nga.field('userId', 'reference')
        .targetEntity(user)
        .targetField(nga.field('username'))
        .label('User'),
    nga.field('comments', 'referenced_list')
        .targetEntity(nga.entity('comments'))
        .targetReferenceField('postId')
        .targetFields([
            nga.field('email'),
            nga.field('name')
        ])
        .sortField('id')
        .sortDir('DESC'),
]);
admin.addEntity(post);*/
    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);

myApp.config(['RestangularProvider', function (RestangularProvider) {
    RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
        if (operation == "getList") {
            // custom pagination params
            if (params._page) {
                params._start = (params._page - 1) * params._perPage;
                params._end = params._page * params._perPage;
            }
            delete params._page;
            delete params._perPage;
            // custom sort params
            if (params._sortField) {
                params._sort = params._sortField;
                params._order = params._sortDir;
                delete params._sortField;
                delete params._sortDir;
            }
            // custom filters
            if (params._filters) {
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
        }
        return { params: params };
    });
}]);