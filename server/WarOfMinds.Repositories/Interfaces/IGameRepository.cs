﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WarOfMinds.Repositories.Entities;


namespace WarOfMinds.Repositories.Interfaces
{
    public interface IGameRepository
    {
        Task<List<Game>> GetAllAsync();
        Task<Game> GetByIdAsync(int id);       
        Task DeleteByIdAsync(int id);
        Task<Game> AddGameAsync(Game game);
        Task<Game> UpdateGameAsync( Game game);
        Task<Game> GetWholeByIdAsync(int id);
    }
}
