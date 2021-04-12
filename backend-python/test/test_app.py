import pytest
from src.app import movie_id_result_to_dict, search_results_to_dict


def test_search_results_to_dict():
    empty_result = search_results_to_dict([], 0)
    assert(empty_result == {'results': [], 'count': 0})

    single_result = search_results_to_dict(
        [[179133, "Loving Vincent (2017)", "Animation|Crime|Drama", 5.0]], 245
    )
    assert(single_result == {
                                'results': [{'id': 179133,
                                            'title': "Loving Vincent (2017)",
                                            'genres': "Animation|Crime|Drama",
                                            'avg_rating': 5.0
                                            }],
                                'count': 245
                            })

def test_movie_id_result_to_dict():
    movie_id_result = movie_id_result_to_dict([179133, "Loving Vincent (2017)", "Animation|Crime|Drama", 5.0, "339877", "3262342"])
    {
        'id': 179133,
        'title': "Loving Vincent (2017)",
        'genres': "Animation|Crime|Drama",
        'avg_rating': 5.0,
        'imdb_id': "339877",
        'tmdb_id': "3262342"
    }
