using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Backboard
{
    public class BlueboardClient
    {
        private string apiKey = string.Empty;
        private string url = string.Empty;
        private HttpClient _client;
        
        
        public BlueboardClient(string url, string apiKey)
        {
            this.url = url;
            this.apiKey = apiKey;
            this._client = new HttpClient();
            this._client.DefaultRequestHeaders.Add("X-Authorization", this.apiKey);
            this._client.DefaultRequestHeaders.Add("Accept", "application/json");
            //this._client.DefaultRequestHeaders.Add("Content-Type", "application/json");
            this._client.BaseAddress = new Uri(this.url);
        }

        public List<BlueboardUserObject> GetUserList()
        {
            var task = Task.Run<string>(() => _client.GetStringAsync( "/api/import"));
            task.Wait();
            var response = JsonConvert.DeserializeObject<BlueboardUsersResponse>(task.Result);
            
            return response.data;
        }

        public string UploadData(GradeCollection collection)
        {
            var content = collection.MakeMessage();
            var task = Task.Run<HttpResponseMessage>(() => _client.PostAsync("/api/import", content));
            task.Wait();
            var task2 = Task.Run<string>(() => task.Result.Content.ReadAsStringAsync());
            task2.Wait();
            return task2.Result as string;
        }
    }
}