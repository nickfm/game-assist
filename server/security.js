Security.permit(['insert'])
        .collections([Games, GameTemplates])
        .ifLoggedIn().apply();

Security.permit(['update', 'remove'])
        .collections([Games, GameTemplates])
        .ifLoggedIn().ifIsCurrentUser().apply();