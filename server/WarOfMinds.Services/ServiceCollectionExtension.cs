﻿using Microsoft.Extensions.DependencyInjection;
using WarOfMinds.Repositories;
using WarOfMinds.Services.Interfaces;
using WarOfMinds.Services.Services;

namespace WarOfMinds.Services
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddRepositories();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IPlayerService, PlayerService>();
            services.AddScoped<IEloCalculator, EloCalculator>();
            services.AddSingleton<IDictionary<int, PlayerForCalcRating>>(opts => new Dictionary<int, PlayerForCalcRating>());

            services.AddAutoMapper(typeof(MappingProfile));
            

            return services;
        }
    }
}
